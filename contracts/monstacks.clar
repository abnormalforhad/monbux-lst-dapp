;; hello-world contract

(define-constant sender 'ST2XV9R7FNJE9ZZYKSR70453N1YT4QDT67AE6Z2PE)
(define-constant recipient 'ST2XV9R7FNJE9ZZYKSR70453N1YT4QDT67AE6Z2PE)

(define-fungible-token novel-token-19)
(ft-mint? novel-token-19 u12 sender)
(ft-transfer? novel-token-19 u2 sender recipient)

(define-non-fungible-token hello-nft uint)

(nft-mint? hello-nft u1 sender)
(nft-mint? hello-nft u2 sender)
(nft-transfer? hello-nft u1 sender recipient)

(define-public (test-emit-event)
  (begin
    (print "Event! Hello world")
    (ok u1)
  )
)

(begin (test-emit-event))

(define-public (test-event-types)
  (begin
    (unwrap-panic (ft-mint? novel-token-19 u3 recipient))
    (unwrap-panic (nft-mint? hello-nft u2 recipient))
    (unwrap-panic (stx-transfer? u60 tx-sender 'ST2XV9R7FNJE9ZZYKSR70453N1YT4QDT67AE6Z2PE))
    (unwrap-panic (stx-burn? u20 tx-sender))
    (ok u1)
  )
)

(define-map store { key: (buff 32) } { value: (buff 32) })

(define-public (get-value (key (buff 32)))
  (begin
    (match (map-get? store { key: key })
      entry (ok (get value entry))
      (err 0)
    )
  )
)

(define-public (set-value (key (buff 32)) (value (buff 32)))
  (begin
    (map-set store { key: key } { value: value })
    (ok u1)
  )
)
